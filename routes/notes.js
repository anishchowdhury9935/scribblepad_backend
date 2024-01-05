const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// get(get) all the notes(data) from http://127.0.0.1:5000/api/users/auth/getUser
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        let userId = await req.user;
        const notes = await Note.find({ user: userId });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// add(post) new notes(data) in http://127.0.0.1:5000/api/users/notes/addnotes
router.post("/addnotes", fetchuser, [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "discription should at least 5 charachter").isLength({ min: 5 }),
    body("tag", "discription should at least 5 charachter").isLength({ max: 20 })
],
    async (req, res) => {
        try {
            // Finds the validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, description, tag } = req.body //destructuring the data object
            const note = new Note({
                title, description, tag, user: req.user
            })
            const savedNote = await note.save()
            res.json({ savedNote })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
// updating(put) existing notes(data) in http://127.0.0.1:5000/api/users/notes/addnotes/:id
router.put("/updatenote/:id", fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "discription should at least 5 charachter").isLength({ min: 5 }),
    body("tag", "discription should at least 5 charachter").isLength({ max: 20 })
],
    async (req, res) => {
        // Finds the validation errors
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        const { title, description, tag } = req.body
        try {
            const newnote = {}
            if(title){newnote.title = title};
            if(description){newnote.description = description};
            if(tag){newnote.tag = tag};
            // find the note to be updated and update it
            let note = await Note.findById(req.params.id)
            if(!note){return res.status(404).send("Not found")}
            if(note.user.toString() !== req.user){
                return res.status(401).send("not allowed")
            }
            let note_update = await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
            res.json({note_update})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
// deleting(delete) existing notes(data) in http://127.0.0.1:5000/api/users/notes/deletenote/:id
router.delete("/deletenote/:id", fetchuser,
    async (req, res) => {
        // find the note to be deleted and delete it
        try {
            let note = await Note.findById(req.params.id)
            if(!note){return res.status(404).send("Not found")}
            if(note.user.toString() !== req.user){
                return res.status(401).send("not allowed")
            }
            let note_deleted = await Note.findByIdAndDelete(req.params.id)
            res.json({"successfully Deleted notes": note_deleted})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router;
