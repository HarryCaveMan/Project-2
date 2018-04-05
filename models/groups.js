module.exports = function(sequelize, DataTypes) {
    var Groups = sequelize.define("Groups", {
        group_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        group_members: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        is_event: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        event_cost: {
            type: DataTypes.DECIMAL(6,2),
            allowNull: true
        },
        route: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    Groups.associate = function(models) {
        models.Groups.belongsToMany(models.User, {
          through: 'UserGroups',
          foreignKey: {
            allowNull: false
          }
        });
    };

    return Groups;
};