'use strict';

//  Simple strategy : split the field into 3 parts (with 1:2:3 proportion) and each player will control its part.
//
//  Player 0 - goalkeeper
//  Player 1 - defender
//  Player 3 - playmaker
//  -------------------------
//  |   |      |            |
//  |   |      |            |
//  | 0 |  1   |     2      |
//  |   |      |            |
//  |   |      |            |
//  -------------------------
//
//  Each player is responcible to kick out the ball from its zone.
'use strict';

var UPPERPLAYER_TICK;
var GOALKEEPER_TICK;
var LOWPLAYER_TICK;

//MAIN
function getPlayerMove(data) {
    var LEFT_SIDE = data.yourTeam.type === "home";
    UPPERPLAYER_TICK = data.playerIndex === 0;
    GOALKEEPER_TICK = data.playerIndex === 1;
    LOWPLAYER_TICK = data.playerIndex === 2;
    console.log("data ", data);
    //check side
    if (LEFT_SIDE) {
        return runLeftSideCode(data);
    } else {
        return runRightSideCode(data);
    }
}
 
//SERVICES

function runLeftSideCode(data) {
    if (UPPERPLAYER_TICK) {
        return runUpPlayerCodeLeftSide(data);
    } else if (GOALKEEPER_TICK) {
        return runGoalkeeperCodeLeftSide(data);
    } else {
        return runLowPlayerCodeLeftSide(data);
    }
}

function runRightSideCode(data) {
    if (UPPERPLAYER_TICK) {
        return runUpPlayerCodeRightSide(data);
    } else if (GOALKEEPER_TICK) {
        return runGoalkeeperCodeRightSide(data);
    } else {
        return runLowPlayerCodeRightSide(data);
    }
}

//-------------
function runUpPlayerCodeLeftSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX = sixthPartOfFieldWidth * 2;
    var playerZoneWidth = sixthPartOfFieldWidth * 3;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if (ballStop.x > currentPlayer.x) {

        // can go and kick it to the opponent side
        direction = getDirectionTo(currentPlayer, ballStop);
        velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
    } else {

        // do not kick to the my goalpost, move to the position behind the ball
        const ballRadius = ball.settings.radius;
        var stopPoint = {
            x: ballStop.x - ballRadius * 2,
            y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 4
        };
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = getDistance(currentPlayer, stopPoint);
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

function runGoalkeeperCodeLeftSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX = sixthPartOfFieldWidth;
    var playerZoneWidth = sixthPartOfFieldWidth * 2;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if ((ballStop.x > playerZoneStartX) && (ballStop.x < playerZoneStartX + playerZoneWidth)) {
        if (ballStop.x > currentPlayer.x) {

            // can go and kick it to the opponent side
            direction = getDirectionTo(currentPlayer, ballStop);
            velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
        } else {

            // do not kick to the my goalpost, move to the position behind the ball
            const ballRadius = ball.settings.radius;
            var stopPoint = {
                x: ballStop.x - ballRadius,
                y: ballStop.y + (ballStop.y > currentPlayer.y ? - ballRadius : + ballRadius) * 3
            };
            direction = getDirectionTo(currentPlayer, stopPoint);
            velocity = getDistance(currentPlayer, stopPoint);
        }
    } else {

        var zonePoint = {
            x: playerZoneStartX,
            y: ball.y + Math.random() * 140 - 20
        };
        direction = getDirectionTo(currentPlayer, zonePoint);
        velocity = getDistance(currentPlayer, zonePoint) < 180 ? 1 : data.settings.player.maxVelocity;
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

function runLowPlayerCodeLeftSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX =  sixthPartOfFieldWidth * 3;
    var playerZoneWidth = sixthPartOfFieldWidth * 4;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if (ballStop.x > currentPlayer.x) {

        // can go and kick it to the opponent side
        direction = getDirectionTo(currentPlayer, ballStop);
        velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
    } else {

        // do not kick to the my goalpost, move to the position behind the ball
        const ballRadius = ball.settings.radius;
        var stopPoint = {
            x: ballStop.x - ballRadius * 2,
            y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 2
        };
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = getDistance(currentPlayer, stopPoint);
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

//-------------

function runUpPlayerCodeRightSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX = sixthPartOfFieldWidth * 2;
    var playerZoneWidth = sixthPartOfFieldWidth * 3;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if (ballStop.x < currentPlayer.x) {

        // can go and kick it to the opponent side
        direction = getDirectionTo(currentPlayer, ballStop);
        velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
    } else {

        // do not kick to the my goalpost, move to the position behind the ball
        const ballRadius = ball.settings.radius;
        var stopPoint = {
            x: ballStop.x + ballRadius * 2,
            y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 4
        };
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = getDistance(currentPlayer, stopPoint);
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

function runGoalkeeperCodeRightSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX = sixthPartOfFieldWidth;
    var playerZoneWidth = sixthPartOfFieldWidth * 3;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if ((ballStop.x < playerZoneStartX) && (ballStop.x > playerZoneStartX - playerZoneWidth)) {
        if (ballStop.x < currentPlayer.x) {

            // can go and kick it to the opponent side
            direction = getDirectionTo(currentPlayer, ballStop);
            velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
        } else {

            // do not kick to the my goalpost, move to the position behind the ball
            const ballRadius = ball.settings.radius;
            var stopPoint = {
                x: ballStop.x + ballRadius,
                y: ballStop.y + (ballStop.y > currentPlayer.y ? - ballRadius : + ballRadius) * 3
            };
            direction = getDirectionTo(currentPlayer, stopPoint);
            velocity = getDistance(currentPlayer, stopPoint);
        }
    } else {

        var zonePoint = {
            x: playerZoneStartX,
            y: ball.y + Math.random() * 140 - 20
        };
        direction = getDirectionTo(currentPlayer, zonePoint);
        velocity = getDistance(currentPlayer, zonePoint) < 180 ? 1 : data.settings.player.maxVelocity;
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

function runLowPlayerCodeRightSide(data) {
    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;
    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX =  sixthPartOfFieldWidth * 3;
    var playerZoneWidth = sixthPartOfFieldWidth * 4;
    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if (ballStop.x < currentPlayer.x) {

        // can go and kick it to the opponent side
        direction = getDirectionTo(currentPlayer, ballStop);
        velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
    } else {

        // do not kick to the my goalpost, move to the position behind the ball
        const ballRadius = ball.settings.radius;
        var stopPoint = {
            x: ballStop.x + ballRadius * 2,
            y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 3
        };
        direction = getDirectionTo(currentPlayer, stopPoint);
        velocity = getDistance(currentPlayer, stopPoint);
    }

    return {
        direction: direction,
        velocity: velocity
    };
}
//-------------

function getDirectionTo(startPoint, endPoint) {
    return Math.atan2(endPoint.y - startPoint.y, endPoint.x - 15  - startPoint.x);
}

function getDistance(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

function getBallStats(ball, gameSettings) {
    var stopTime = getStopTime(ball);
    var stopDistance = ball.velocity * stopTime
        - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

    var x = ball.x + stopDistance * Math.cos(ball.direction);
    var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

    // check the reflection from field side
    if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

    return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
    return ball.velocity / ball.settings.moveDeceleration;
}


//RUN
onmessage = (e) => postMessage(getPlayerMove(e.data));




//
// function getPlayerMove(data) {
//
//     var currentPlayer = data.yourTeam.players[data.playerIndex];
//     var ball = data.ball;
//
//     var sixthPartOfFieldWidth = data.settings.field.width / 6;
//     var playerZoneStartX = sixthPartOfFieldWidth * [2, 1, 2][data.playerIndex];
//     var playerZoneWidth = sixthPartOfFieldWidth * [4, 3, 4][data.playerIndex];
//
//     var ballStop = getBallStats(ball, data.settings);
//     var direction = currentPlayer.direction;
//     var velocity = currentPlayer.velocity;
//
//     if ((ballStop.x > playerZoneStartX) && (ballStop.x < playerZoneStartX + playerZoneWidth)) {
//         // ball stops in the current player zone
//         if (ballStop.x > currentPlayer.x) {
//             // can go and kick it to the opponent side
//             direction = getDirectionTo(currentPlayer, ballStop);
//             velocity = data.settings.player.maxVelocity; // dont care about acceleration, game engine reduce it to max allowed value
//         } else {
//             // do not kick to the my goalpost, move to the position behind the ball
//             const ballRadius = ball.settings.radius;
//             var stopPoint = {
//                 x: ballStop.x - ballRadius * 2,
//                 y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 5
//             }
//             direction = getDirectionTo(currentPlayer, stopPoint);
//             velocity = getDistance(currentPlayer, stopPoint);
//         }
//     } else {
//         var zonePoint = {
//             x: playerZoneStartX + 10,
//             y: ball.y + Math.random() * 40 - 20
//         };
//         direction = getDirectionTo(currentPlayer, zonePoint);
//         velocity = getDistance(currentPlayer, zonePoint) < 120 ? 1 : data.settings.player.maxVelocity;
//     }
//
//     return {
//         direction: direction,
//         velocity: velocity
//     };
// }
//
//
// //---------------------
// function getDirectionTo(startPoint, endPoint) {
//     return Math.atan2(endPoint.y - startPoint.y, ((endPoint.x) - 15) - startPoint.x);
// }
//
// function getDistance(point1, point2) {
//     return Math.hypot(point1.x - point2.x, point1.y - point2.y);
// }
//
// function getBallStats(ball, gameSettings) {
//     var stopTime = getStopTime(ball);
//     var stopDistance = ball.velocity * stopTime
//         - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;
//
//     var x = ball.x + stopDistance * Math.cos(ball.direction);
//     var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));
//
//     // check the reflection from field side
//     if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;
//
//     return {stopTime, stopDistance, x, y};
// }
//
// function getStopTime(ball) {
//     return ball.velocity / ball.settings.moveDeceleration;
//
// }
// //---------------------------------
//
// onmessage = (e) => postMessage(getPlayerMove(e.data));
