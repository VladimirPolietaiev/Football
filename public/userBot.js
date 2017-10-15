'use strict';

//MAIN
function getPlayerMove(data) {

    var currentPlayer = data.yourTeam.players[data.playerIndex];
    var ball = data.ball;

    var sixthPartOfFieldWidth = data.settings.field.width / 6;
    var playerZoneStartX = sixthPartOfFieldWidth * [0, 1, 2][data.playerIndex];
    var playerZoneWidth = sixthPartOfFieldWidth * [3, 4, 4][data.playerIndex];

    var ballStop = getBallStats(ball, data.settings);
    var direction = currentPlayer.direction;
    var velocity = currentPlayer.velocity;

    if ((ballStop.x > playerZoneStartX) && (ballStop.x < playerZoneStartX + playerZoneWidth)) {
        if (ballStop.x > currentPlayer.x) {
            direction = getDirectionTo(currentPlayer, ballStop);
            velocity = data.settings.player.maxVelocity;
        } else {
            const ballRadius = ball.settings.radius;
            var stopPoint = {
                x: ballStop.x - ballRadius * 2,
                y: ballStop.y + (ballStop.y > currentPlayer.y ? -ballRadius : +ballRadius) * 5
            };
            direction = getDirectionTo(currentPlayer, stopPoint);
            velocity = getDistance(currentPlayer, stopPoint);
        }
    } else {
        var zonePoint = {
            x: playerZoneStartX + 10,
            y: ball.y + Math.random() * 40 - 20
        };
        direction = getDirectionTo(currentPlayer, zonePoint);
        velocity = getDistance(currentPlayer, zonePoint) < 20 ? 1 : data.settings.player.maxVelocity;
    }

    return {
        direction: direction,
        velocity: velocity
    };
}

//SERVICES
function getDirectionTo(startPoint, endPoint) {
    return Math.atan2(endPoint.y - startPoint.y, ((endPoint.x) - 15) - startPoint.x);
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

    return {stopTime, stopDistance, x, y};
}

function getStopTime(ball) {
    return ball.velocity / ball.settings.moveDeceleration;

}

//RUN
onmessage = (e) => postMessage(getPlayerMove(e.data));
