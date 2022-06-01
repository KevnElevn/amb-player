# AmbienceGen
## What is this?
AmbienceGen is a web application where users can combine the audio components of media to create dynamic soundscapes. This is done by organizing sounds into groups that play at fixed or variable intervals. This creates an experience unlike prerecorded audio, which is the same every playback.

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

Notes to use:
-Needs file 'connection.js' with database URL
