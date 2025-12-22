import wardService from '../services/ward.js';

const controller = {
  listWard: function (req, res, next) {
    wardService.findAll().then((wards) => {
      res.json(wards);
    }).catch(next);
  },
}

export default controller;