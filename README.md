# [Karen's Petition Portal](https://karenspetitionportal.herokuapp.com/)
![Karen's Portal Logo](https://auspic.s3.eu-central-1.amazonaws.com/7sI1K2aHlgCjKk91XqVV.jpeg) 

This page is a petition portal inspired by the meme Karen, where every Karen can register, check available petitions and sign it. Users can also check who else has signed it, edit their profile, change password and, delete signatures.

### Requirements

**Logeded Out User**

- User is redirect to Register page
- Register page must have a *Login here* button to redirect user to login page

**Logeded In User**

- User must be able to acess a menu bar with the option *Petitions, My Signatures, My Account and Log Out* from every page
- After log in show page with a list of links of avaible petitions
- When clicked, user should be redirected to the selected petition page with full description and signing box.
- When a new Signarute is submit validates if:
  - Field was not blank
  - User has not signed this petition before
- If signature was complete succesfully, user must be redirected to a page with a *Thank you* message, image of the signature and link to access the signatures list
- When the signature link is clicked, user must be redirected to a page with a list of all signers, with Name, age and, City. In case the user has add a webpage address to its profile, the Name field must be a link to this webpage and the City field must be a link to check a list of signers by city.




