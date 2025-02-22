const mongoose = require('mongoose');
const { MAX_TEAMS_PER_SECTION } = require('../utils/constants');

const UserTeamSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    section: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
      },
      selectedTeams: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
UserTeamSchema.index({ userId: 1, 'section.sectionId': 1 });
UserTeamSchema.index({ createdAt: 1 });

// Validate maximum teams
UserTeamSchema.path('section.selectedTeams').validate(function (teams) {
  return teams.length <= MAX_TEAMS_PER_SECTION;
}, `Maximum ${MAX_TEAMS_PER_SECTION} teams allowed per section`);

// Virtual for total followers
UserTeamSchema.virtual('totalFollowers').get(function () {
  return this.section.selectedTeams.reduce(
    (sum, team) => sum + (team.followers || 0),
    0,
  );
});

const UserTeam = mongoose.model('UserTeam', UserTeamSchema);
module.exports = UserTeam;
