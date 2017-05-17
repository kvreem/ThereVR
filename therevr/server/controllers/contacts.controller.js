/*
 * Henry: This is not being used at all.
 */

const Contacts = require('../models/index').contact;
const { basicCRUD } = require('./addCrud');

function addCRUD(router) {
  const info = {
    baseRoute: '/contacts',
    name: 'contact',
    pluralName: 'contacts',
  };

  return basicCRUD(Contacts, router, info);
}

module.exports = {
  addCRUD,
};
