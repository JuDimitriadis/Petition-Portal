# [Karen's Petition Portal](https://karenspetitionportal.herokuapp.com/)
![Karen's Portal Logo](https://auspic.s3.eu-central-1.amazonaws.com/7sI1K2aHlgCjKk91XqVV.jpeg) 

This page is a petition portal inspired by the meme Karen, where every Karen can register, check available petitions and sign it. Users can also check who else has also signed it, edit their profile and, delete signatures.

### Requirements

- Logeded Out User
  - User is redirect to Register page
  - Register page must have a *Login here* button to redirect user to login page
- Logeded In User
  -After log in show page with a list of links of avaible petitions
    -When clicked, user should be redirected to the selected petition page with full description and signing box.
    -When a new Signarute is submit validates if:
      -Field was not blank
      -User has not signed this petition before
  -If signature was complete succesfully, user must be redirected to a page with a *Thank you* message, image of the signature and link to access the signatures list


