const Follow = require('../models/Follow');
const {join} = require("node:path");
const {readFileSync} = require("node:fs");
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await Follow.find();
            res.json(users);
        } catch (error) {
            console.error('Error while getting dummy events:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async getUsers(req, res) {
        try {
            const currentUserId = req.params.id;
            const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } // sich selbst ausschließen
      }
    },
    {
      $lookup: {
        from: "follows",
        let: { otherUserId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$follower", "$$otherUserId"] },                     // die andere Person
                  { $eq: ["$following", new mongoose.Types.ObjectId(currentUserId)] } // du selbst
                ]
              }
            }
          }
        ],
        as: "followData"
      }
    },
    {
      $addFields: {
        follow: { $gt: [{ $size: "$followData" }, 0] }
      }
    },
    {
      $project: {
        password: 0,
        followData: 0
      }
    }
  ]);
            res.json(users);
        } catch (error) {
            console.error('Error while getting dummy events:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async isFollow(req, res) {        
            const follower = req.params.fid;
            const following = req.params.uid;

            if (!follower || !following) {
                return res.status(400).json({ message: "Follower und Following müssen angegeben werden." });
            }
            if (follower === following) {
                return res.status(400).json({ message: "Ein Benutzer kann sich nicht selbst folgen." });
            }

            const existingFollow = await Follow.findOne({ follower, following });
            if(existingFollow) {
              res.status(200).json({ follow: true });
            } else {
              res.status(200).json({ follow: false });
            }          
    },
    async updateToggle(req, res) {        

            const follower = req.params.fid;
            const following = req.params.uid;

            if (!follower || !following) {
                return res.status(400).json({ message: "Follower und Following müssen angegeben werden." });
            }

            if (follower === following) {
                return res.status(400).json({ message: "Ein Benutzer kann sich nicht selbst folgen." });
            }


        try {            
            const existingFollow = await Follow.findOne({ follower, following });

        if (existingFollow) {
            // Wenn bereits vorhanden → lösche den Eintrag = entfolgen
            await Follow.deleteOne({ _id: existingFollow._id });
            return res.status(200).json({ message: "Entfolgt." });
        } else {
            // Wenn noch nicht vorhanden → Eintrag hinzufügen = folgen
            const newFollow = new Follow({ follower, following });
            const savedFollow = await newFollow.save();
            return res.status(201).json({ message: "Gefolgt.", data: savedFollow });
        }

            //console.log(followerId, followingId)
            res.status(200).json({ message: "Followstatus changed" });
          } catch (err) {
            console.error("Fehler beim Follow-Toggle:", err);
            return res.status(500).json({ message: "Serverfehler." });
         }
    }
}
