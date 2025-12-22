import userService from '../services/user.js';

const controller = {
  listUser: function (req, res, next) {
    userService.findAll().then((users) => {
      res.json(users);
    }).catch(next);
  },

  getUser: function (req, res, next) {
    const id = Number(req.params.id);
    const { currentUser } = req;
    if (currentUser.id !== id && !currentUser.isAdmin) {
      return res.unauthorized();
    }
    userService.findById(id).then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.notFound();
      }
    }).catch(next);
  },
}

export default controller;