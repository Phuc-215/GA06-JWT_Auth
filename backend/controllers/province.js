import provinceService from '../services/province.js';

const controller = {
  listProvince: function (req, res, next) {
    provinceService.findAll().then((provinces) => {
      res.json(provinces);
    }).catch(next);
  },
}

export default controller;