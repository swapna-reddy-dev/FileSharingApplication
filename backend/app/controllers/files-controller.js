const File = require('../models/files-model')
const SharedFile = require('../models/sharedFiles-model')
const User = require('../models/users-model')
const {validationResult} = require('express-validator')
const path = require('path');
const fs = require('fs');
const { parseISO } = require('date-fns');
const humanFileSize = require('../middlewares/fileSize')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const filesCtrl = {}

filesCtrl.upload = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { filename, path: filePath } = req.file;
    console.log(req.file)
    try {
        const fileStats = fs.statSync(filePath);  // Get file stats to determine file size
        const fileSize = fileStats.size;  // Get file size in bytes

        const body = {}
        body.owner = req.user.id
        if(req.body.fileName) {
            body.fileName = req.body.fileName
        } else {
            body.fileName = filename
        }
        body.filePath = filePath
        body.humanFileSize = humanFileSize(fileSize)
        const file = new File(body)
        await file.save();
        res.status(201).json(file);
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

filesCtrl.getMyFiles = async (req, res) => {
    try {
      const files = await File.find({ owner: req.user.id }).populate({
        path: 'owner',
        select: '_id username email'
      }).populate('sharedWith')
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  filesCtrl.viewFile = async (req, res) => {
    const { fileId } = req.params;
    try {
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      //Validate that the user has access to this file
      const sharedFile = await SharedFile.findOne({
        fileId: fileId,
        sharedWithUserId: { $in: [req.user.id] },
         $or: [
          { accessExpiry: { $gt: new Date() } },
          { accessExpiry: null }
        ]
      });
  
      const myfile = await File.findOne({
        _id: fileId,
        owner: req.user.id
      });
  
      if (!myfile && !sharedFile) {
        return res.status(403).json({ message: 'You do not have access to this file or access has expired' });
      }
  
      const filePath = path.resolve(__dirname, '..', file.filePath);
    console.log('File path:', filePath);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist:', err);
        return res.status(404).json({ message: 'File not found on server' });
      }

      // File exists, send the file
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ message: 'Error sending file' });
        }
      });
    });
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  filesCtrl.shareFile = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { fileId, sharedWithUserId, accessExpiry } = req.body;
    const parsedAccessExpiry = accessExpiry ? parseISO(accessExpiry) : null;
    try {
      const sharedFile = new SharedFile({
        fileId,
        sharedWithUserId,
        accessExpiry: parsedAccessExpiry
      });
      await sharedFile.save();


      //send find the users
      const users = await User.find({_id: { $in: sharedWithUserId }})
      const userIds = users.map(ele => ele._id)
      //find the file
      const file = await File.findOne({_id: fileId}).populate('owner')
      file.sharedWith = [...file.sharedWith, ...userIds]
      await file.save()
      console.log('file',file)

      //send the mail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: process.env.SECRET_EMAIL,
           pass: process.env.SECRET_PASSWORD
        }
     })
    
     users.forEach((user) => {
      const accessExpiryText = parsedAccessExpiry ? `This file will be accessible until ${parsedAccessExpiry}` : 'No access time limit specified'
      const mailOptions = {
        from: process.env.SECRET_EMAIL,
        to: `${user.email}`,
        subject: `${file.owner.username} shared a file with you`,
        html: `<p>Hello ${user.username},</p>
        <p>${file.owner.username}(${file.owner.email}) from File Management System shared a file with you. Click <a href="http://localhost:3000/verify-to-view/${sharedFile._id}">here</a> to view it.</p>
        <p>${accessExpiryText}</p>`,
      }
     transporter.sendMail(mailOptions, function(error, info){
        if (error) {
           console.log(error);
        } else {
           console.log('Email sent: ' + info.response);
        }
     });  
     })

      res.status(201).json(sharedFile);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  filesCtrl.getSharedFiles = async (req, res) => {
    try {
      //console.log(req.user)
      const sharedFiles = await SharedFile.find({ sharedWithUserId: req.user.id }).populate({
        path: 'fileId',
        populate: [
          {
            path: 'owner',
            select: '_id username email'
          }
        ]
      });
    res.json(sharedFiles);
    } catch(err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  filesCtrl.oneSharedFile = async (req,res) => {
    try {
      const {id} = req.params
      const sharedFiles = await SharedFile.findOne({ _id: id }).populate({
        path: 'fileId',
        populate: [
          {
            path: 'owner',
            select: '_id username email'
          }
        ]
      });
    res.json(sharedFiles);
    } catch(err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

module.exports = filesCtrl