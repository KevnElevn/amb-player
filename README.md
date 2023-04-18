# AmbPlayer
## What is this?
AmbPlayer is a web application where users can combine the audio components of media to create dynamic soundscapes. Users can create experiences unlike prerecorded audio, which are the same every playback, by organizing sounds into groups that play at fixed or variable intervals.

## Amb
An Amb is a collection of data that defines and configures the soundscape. They contain the following:

    Sound Groups
    -Title
    -Interval between plays (in seconds)
    -Sound Elements
    --Name
    --URL
    --Volume
    --Start and end timestamps (in seconds)
    --Number of additional times played before interval

## Required env variables
NODE_ENV
DATABASE_URL
AUTH0_AUDIENCE
AUTH0_DOMAIN