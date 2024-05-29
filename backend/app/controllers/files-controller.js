const File = require('../models/files-model')
const SharedFile = require('../models/sharedFiles-model')
const {validationResult} = require('express-validator')
const path = require('path');
const fs = require('fs');
const humanFileSize = require('../middlewares/fileSize')

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
        body.fileSize = fileSize
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
      const files = await File.find({ owner: req.user.id });
      const filesWithHumanSize = files.map(file => ({
        ...file._doc,
        humanFileSize: humanFileSize(file.fileSize)
      }));
      res.json(filesWithHumanSize);
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
        sharedWithUserId: req.user.id,
        accessExpiry: { $gt: new Date() }
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
    try {
      const sharedFile = new SharedFile({
        fileId,
        sharedWithUserId,
        accessExpiry: new Date(accessExpiry)
      });
      await sharedFile.save();
      res.status(201).json(sharedFile);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  filesCtrl.getSharedFiles = async (req, res) => {
    try {
      //console.log(req.user)
      const sharedFiles = await SharedFile.find({ sharedWithUserId: req.user.id }).populate('fileId');
      //console.log(sharedFiles)
      const sharedFilesWithHumanSize = sharedFiles.map(sharedFile => ({
        ...sharedFile._doc,
        fileId: {
          ...sharedFile.fileId._doc,
          humanFileSize: humanFileSize(sharedFile.fileId.fileSize)
        }
      }));
    res.json(sharedFilesWithHumanSize);
    } catch(err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

module.exports = filesCtrl