initial files/format taken from MERN stack tutorial: https://www.mongodb.com/resources/languages/mern-stack-tutorial

requires a config.env of this format:
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/employees?retryWrites=true&w=majority
PORT=5050

The Adventurer's Action Deck is designed to be an action-first look at a Dungeons and Dragons character sheet. 
While supporting a full character sheet based off of the 5e sheet and supporting rolls for common scenarios, the "deck" is compromised of a series of actions that character can take, with the deck itself responding to resource utilization (standard actions, bonus actions, triggered actions, etc.) on a turn by turn basis. Can also utilize it as a way to track spell slots and spells. Most content will be user-submitted, although an OGL template will be provided. 

CURRENTLY USES A MONGODB ATLAS DB

To install:
git clone https://github.com/bmpriest/adventurers-action-deck.git
cd .\adventurers-action-deck\server
npm install
cd ..\client
npm install
place the config.env under \server\
in one terminal, node --env-file=config.env server
in one terminal, npm run dev

enter some information and see it show up! 

more to come
