const { Thought, User } = require('../models');
const thoughtController = {

    //GET ALL THOUGHTS

    getAllThoughts(req, res) {
        Thought.find()
            .sort({ createdAt: -1 })
            .then((dbThoughtData) => {
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //GET SINGLE THOUGHT

    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //NEW THOUGHT

    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json({ message: 'Thought created!' });
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //UPDATE THOUGHT

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { runValidators: true, new: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //DELETE THOUGHT

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }

                // REMOVE THOUGHT ID FROM USER FIELD

                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id, but thought deleted!' });
                }
                res.json({ message: 'Thought deleted'});
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //ADD REACTION

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    },

    //REMOVE REACTION

    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought foudn with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);res.status(500).json(err);
            });
    }
};

module.exports = thoughtController;
