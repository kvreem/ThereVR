const { async } = require('../helpers/index');
// This module can be used to add CRUD functions to any model.
// Example routes:
// GET /{info.pluralName} returns all docs in model
// GET /{info.pluralName}/:user_id returns all doc that belong to :user_id
/* eslint-disable */

/**
 * Get all docs for model
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function getAll(Model, req, res, info) {
  async(function* () {
    try {
      const foundDocs = yield Model.find().exec();

      res.json({ [info.pluralName]: foundDocs })
    }
    catch (err) {
      res.status(500).send(err);
    }
  })();
}

/**
 * Save a doc
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function addDoc(Model, req, res, info) {
  async(function* () {
    try {
      const newDoc = new Model(req.body.doc);

      const savedDoc = yield newDoc.save();

      res.json({ [info.name]: savedDoc })
    }
    catch (err) {
      res.status(500).send(err);
    }

  })();
}

/**
 * Save a sub-doc
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function addSubDoc(Model, req, res, info) {
  async(function* ()  {
    try {
      const doc = Model.findOne({ cuid: req.params.cuid }).exec();
      req.body.children.map((subDoc) => {
        return doc.children.push(subDoc);
      });

      const savedDoc = yield doc.save();

      res.json({ [info.name]: savedDoc });
    }
    catch (err) {
      res.status(500).send(err);
    }
  })();
}

/**
 * Get a single doc
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function getDoc(Model, req, res, info) {
  Model.findOne({ user_id: req.user_id }).exec((err, doc) => {
    if (err) return res.status(500).send(err);
    return res.json({ [info.name]: doc });
  });
}

/**
 * Delete a post
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function deleteDoc(Model, req, res, info) {
  Model.findOne({ cuid: req.params.cuid }).exec((err, doc) => {
    if (err) return res.status(500).send(err);

    const deleteDoc = doc.remove(() => {
      return res.status(200).end();
    });

    return deleteDoc;
  });
}

/**
 * Save a sub-doc
 * @param model
 * @param req
 * @param res
 * @returns void
 */
function deleteSubDoc(Model, req, res, info) {
  async(function* ()  {
    try {
      const doc = Model.findOne({ cuid: req.params.cuid }).exec();
      doc.children.id(req.body.id).remove();
      const savedDoc = yield doc.save();

      res.json({ [info.name]: savedDoc });
    }
    catch (err) {
      res.status(500).send(err);
    }
  })();
}

/**
 * Helper function for addBasic.
 * @param Model - Mongoose model
 * @param router - Express router
 * @param info - Object that describes the route
 * @param cuidRoute - string that represents what to search docs by
 * @returns void
 */
function addBasic(Model, router, info, cuidRoute) {
  router.route(info.baseRoute).get((req, res) => {
    if (info.getAll) info.getAll(Model, req, res);

    getAll(Model, req, res, info);
  });

  router.route(cuidRoute).get((req, res) => {
    if (info.getDoc) info.getDoc(Model, req, res);

    getDoc(Model, req, res, info);
  });

  router.route(info.baseRoute).post((req, res) => {
    if (info.addDoc) info.addDoc(Model, req, res);

    addDoc(Model, req, res, info);
  });

  router.route(cuidRoute).delete((req, res) => {
    if (info.deleteDoc) info.deleteDoc(Model, req, res);

    deleteDoc(Model, req, res, info);
  });
}

/**
 * Add CRUD to model
 * @param Model - Mongoose model
 * @param router - Express router
 * @param info - Object that describes the route
 * @returns router
 */
function basicCRUD(Model, router, info) {
  const cuidRoute = `${info.baseRoute}/:user_id`;
  addBasic(Model, router, info, cuidRoute);

  if (info.subDoc) {
    router.route(`${cuidRoute}/add`).put((req, res) => {
      // if (info.deleteDoc) info.deleteDoc(Model, req, res);
      addSubDoc(Model, req, res, info);
    });

    router.route(`${cuidRoute}/delete`).delete((req, res) => {
      // if (info.deleteDoc) info.deleteDoc(Model, req, res);
      deleteSubDoc(Model, req, res, info);
    });
  }

  return router;

}

module.exports = {
  basicCRUD,
  deleteDoc,
  getDoc,
  addSubDoc,
  addDoc,
  getAll,
};
