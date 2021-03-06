import Ember from 'ember';
import RESTSerializer from 'ember-data/serializers/rest';

const { underscore } = Ember.String;

export default RESTSerializer.extend({
  isNewSerializerAPI: true,

  normalizeResponse(store, primaryModel, payload) {
    delete payload.ok;
    delete payload.cache_ts; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    return this._super(...arguments);
  },

  modelNameFromPayloadKey(key) {
    if (key === 'members') {
      return 'user';
    }

    return this._super(...arguments);
  },

  keyForAttribute(attr) {
    return underscore(attr);
  },

  _normalizeUserProfile(hash) {
    if (typeof hash.profile !== 'object') {
      return;
    }

    // Merge profile into attribute hash
    for (let key in hash.profile) {
      let transformedKey = key;
      if (/^image_(\d+)$/.test(key)) {
        transformedKey = key.replace(/_/, '');
      }
      hash[transformedKey] = hash.profile[key];
    }

    delete hash.profile;
  },

  normalize(typeClass, hash) {
    if (typeClass.modelName === 'user') {
      this._normalizeUserProfile(hash);
    }

    return this._super(...arguments);
  }
});
