const { User, Thought } = require('../models');
const userController = {

    //GETS ALL USERS

    getAllUsers(req, res) {
        User.find()
            .select('-__v')
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //GETS SINGLE USERS

    getUserById(req, res) {
        User.findOne({ _id: req.params.userId})
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //NEW USER

    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //UPDATES USER

    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { runValidators: true, new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //DELETES USER

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData)
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //ADDS FRIEND

    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //REMOVES FRIEND

    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};

module.exports = userController;
