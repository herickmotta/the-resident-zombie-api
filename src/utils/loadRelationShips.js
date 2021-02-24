const Flag = require('../models/Flag');
const LastLocation = require('../models/LastLocation');
const Resource = require('../models/Resource');
const Survivor = require('../models/Survivor');
const SurvivorResource = require('../models/SurvivorResource');

Survivor.hasMany(Flag);
LastLocation.belongsTo(Survivor);
Survivor.hasMany(LastLocation, { as: 'lastLocation' });
Survivor.belongsToMany(Resource, { through: SurvivorResource, as: 'SurvivorResource' });
Resource.belongsToMany(Survivor, { through: SurvivorResource });
Survivor.hasMany(SurvivorResource, { as: 'resources' });
SurvivorResource.belongsTo(Survivor);
Resource.hasMany(SurvivorResource);
SurvivorResource.belongsTo(Resource);
