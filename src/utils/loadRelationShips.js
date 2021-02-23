const Flag = require('../models/Flag');
const Resource = require('../models/Resource');
const Survivor = require('../models/Survivor');
const SurvivorResource = require('../models/SurvivorResource');

Survivor.hasMany(Flag);
Survivor.belongsToMany(Resource, { through: SurvivorResource });
