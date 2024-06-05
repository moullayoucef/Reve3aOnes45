const express = require('express')
const morgan=require('morgan')
const nodemailer = require('nodemailer');
const Tasks = require('../model/Tasks')
const moment = require('moment');
const router = express.Router();
const usermidd = require("../middlewere/userMidd");
const User = require("../model/User");

router.get('/tasks', usermidd,async (req, res) => {
    try {
        const {_id}= req.user._doc;
        const find = await User.findById(_id)
        const tasks =find.tasks
        let total = {tasks: [{}]}
        for (let i = 0 ; i<tasks.length;i++){
            const taskss = await Tasks.findById(tasks[i])
            console.log(taskss)
            if (!taskss){
                continue;
            }
            total.tasks.push({Untitled : taskss.Untitled, description : taskss.description , created : taskss.created , status : taskss.status , link : taskss.link , })
        }
        res.status(200).json(total);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: "Une erreur s'est produite lors de la récupération des tâches." });
    }
});




router.post('/addtask', usermidd,async (req, res)=>{
    try{
        const task = new Tasks(req.body)
        console.log(req.body)
        console.log(task)
        await task.save()
        const {_id} = req.user._doc;
        const finduser = await User.findById(_id);
        finduser.tasks.push(task._id)
        await finduser.save();
        res.status(200).json({message: "task bien sauvegarder",id :task._id})
    }catch(err){
        res.status(500).json({erreur: err})
    }
    })   

router.post('/edit/:taskId', function(req, res) {

  const taskId = req.params.taskId;
  const update = req.body; 

  
  Tasks.findByIdAndUpdate(taskId, update)
      .then(() => {
          
          res.status(200).json({message : "task updated"})
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send("Une erreur s'est produite lors de la modification de la tâche.");
      });
});

router.post('/delete/:taskId', function(req, res) {
  const taskId = req.params.taskId;

  
  Tasks.findByIdAndDelete(taskId)
      .then(() => {
         
          res.status(201).json({message : "task deleted"})
      })
      .catch((err) => {
          
          console.error(err);
          res.status(500).send("Une erreur s'est produite lors de la suppression de la tâche.");
      });
});
    
                
       


router.post('/remind', (req, res) => {
    console.log('Je suis dans remind');
    const { email, sujet, heure } = req.body;
    console.log(email,sujet,heure)
    if (!email || !sujet || !heure) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les données requises.' });
    }

    const contenu = ["C'est le moment de", sujet].join(' ');

    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD 
        }
    });

    const heureRappel = moment(heure, 'HH:mm').toDate();
    
    if (!moment(heureRappel, 'HH:mm', true).isValid()) {
        return res.status(400).json({ message: 'Veuillez fournir une heure valide au format HH:mm.' });
    }

    const maintenant = Date.now();
    const tempsJusqueHeureRappel = heureRappel.getTime() - maintenant;

    const mailOptions = {
        from: process.env.EMAIL ,
        to: email,
        subject: sujet,
        text: contenu
    };

    const rappel = setTimeout(() => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de l\'e-mail.' });
            } else {
                console.log('E-mail envoyé: ');
            }
        });
    }, tempsJusqueHeureRappel);
    
    res.status(200).json({ message: 'E-mail envoyé avec succès.' });
});
module.exports = router
