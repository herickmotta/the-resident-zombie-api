/* eslint-disable no-param-reassign */
const Resource = require('../models/Resource');

class ResourcesController {
  async getAll() {
    return Resource.findAll();
  }
}

module.exports = new ResourcesController();
