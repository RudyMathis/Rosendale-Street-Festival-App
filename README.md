# Rosendale Street Festival App
 
Test Frontend

cd client
npm run dev

Test Backend

cd server
node --env-file=.env server

Important Info:
--Labels from backend are used through most of the app
    -- Before adding new fields be aware of RecordsType to make sure we pass in correct data
    -- If possible add defaults for values in case uploaded or added records are empty, this helps sorting and filtering
-- This app uses a few Context components that rely on eachother so be careful when calling them
-- Front end specific labels help centeralize data if it's not a record label or role label and you want to update its text
its probably there