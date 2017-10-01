/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const mysql = require('mysql');

const connection = mysql.createConnection({
        host     : 'mytestdb.ckdb5z1mnqzu.us-east-1.rds.amazonaws.com',
        database : 'testdb',
        user     : 'tomato',
        password : 'whoareyoutomato',
      
});

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.8a0d0b07-256e-4d81-b835-09ee76eb44d3';

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    'A year on Mercury is just 88 days long.',
    'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
    'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
    'On Mars, the Sun appears about half the size as it does on Earth.',
    'Earth is the only planet not named after a god.',
    'Jupiter has the shortest day of all the planets.',
    'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
    'The Sun contains 99.86% of the mass in the Solar System.',
    'The Sun is an almost perfect sphere.',
    'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
    'Saturn radiates two and a half times more energy into space than it receives from the sun.',
    'The temperature inside the Sun can reach 15 million degrees Celsius.',
    'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



const handlers = {
    'LaunchRequest': function () {
        this.emit('SubjectIntent');
    },
    'SubjectIntent': function () {
        const connection = mysql.createConnection({
                host     : 'mytestdb.ckdb5z1mnqzu.us-east-1.rds.amazonaws.com',
                database : 'testdb',
                user     : 'tomato',
                password : 'whoareyoutomato',
              
        });


        console.log('Then run MySQL code:');
        var that = this;

        connection.connect(function(err) {
            console.log('Inside connection.connect() callback');
            if (!err) {
                console.log("Database is connected ... ");
                queryStr = "SELECT * FROM Subject";

                connection.query(queryStr,
                    function(err, result) {
                        console.log("Inside connection.query() callback")
                        if (!err) {
                            console.log("Query Successful! Ending Connection.");
                            console.log('result', result);
                            var subjectReply = 'Would you like to learn about ';
                            for ( var i = 0; i < result.length; i++ ) {
                                subjectReply += result[i].SubjectName;
                                if ((i+1) < result.length) {
                                    subjectReply += ' or '
                                }
                            }
                            subjectReply += "?";


                            that.emit(':ask', subjectReply, subjectReply);

                        } else {
                            console.log("Query error!");
                        }
                    });
            } else {
                console.log("Error connecting database ..." + err.message);
            }
        });
 
    },
    'CourseIntent': function () {
        const connection = mysql.createConnection({
                host     : 'mytestdb.ckdb5z1mnqzu.us-east-1.rds.amazonaws.com',
                database : 'testdb',
                user     : 'tomato',
                password : 'whoareyoutomato',
              
        });

        console.log('Then run MySQL code:');
        var that = this;

        var intentObj = this.event.request.intent;
        var subjectReply = "Choosing " + intentObj.slots.Subject.value + ". ";

        connection.connect(function(err) {
            console.log('Inside connection.connect() callback');
            if (!err) {
                console.log("Database is connected ... ");
                queryStr = "SELECT * \
                    FROM Course\
                    INNER JOIN Subject\
                    ON Subject.PK_ID = Course.FK_SubjectID\
                    WHERE Subject.SubjectName LIKE \'%" + intentObj.slots.Subject.value + "%\'";
                
                connection.query(queryStr,
                    function(err, result) {
                        console.log("Inside connection.query() callback")
                        if (!err) {
                            console.log("Query Successful! Ending Connection.");
                            console.log('result', result);

                            var subjectReply = 'Would you like to learn about ';
                            for ( var i = 0; i < result.length; i++ ) {
                                subjectReply += result[i].CourseName;
                                if ((i+1) < result.length) {
                                    subjectReply += ', or'
                                }
                            }
                            subjectReply += "?";

                            that.emit(':ask', subjectReply, subjectReply);

                        } else {
                            console.log("Query error!");
                        }
                    });
            } else {
                console.log("Error connecting database ..." + err.message);
            }
        });
    },
    'TopicIntent': function () {
        const connection = mysql.createConnection({
                host     : 'mytestdb.ckdb5z1mnqzu.us-east-1.rds.amazonaws.com',
                database : 'testdb',
                user     : 'tomato',
                password : 'whoareyoutomato',
              
        });

        console.log('Then run MySQL code:');
        var that = this;

        var intentObj = this.event.request.intent;
        var subjectReply = "Choosing " + intentObj.slots.Course.value + ". ";

        connection.connect(function(err) {
            console.log('Inside connection.connect() callback');
            if (!err) {
                console.log("Database is connected ... ");
                queryStr = "SELECT * \
                    FROM Topic\
                    INNER JOIN Course\
                    ON Topic.FK_CourseID = Course.PK_ID\
                    WHERE Course.CourseName LIKE \'%" + intentObj.slots.Course.value + "%\'";

                connection.query(queryStr,
                    function(err, result) {
                        console.log("Inside connection.query() callback")
                        if (!err) {
                            console.log("Query Successful! Ending Connection.");
                            console.log('result', result);

                            var i = Math.floor(Math.random() * result.length);
                            subjectReply += result[i].TopicTitle;
                            subjectReply += '. '
                            subjectReply += result[i].TopicAnswer;
                            subjectReply += '. '
                            that.emit(':tell', subjectReply);

                        } else {
                            console.log("Query error!");
                        }
                    });
            } else {
                console.log("Error connecting database ..." + err.message);
            }
        });
    },
    'ShutupIntent': function() {
        this.emit(':tell', 'Ough, it hurts my feelings. * CRY *. SHUTING DOOOOOOoooowwwwnnn');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};


//Helpers
const buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    };
};

const generateResponse = (sessionAttributes, speechletResponse) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
};
