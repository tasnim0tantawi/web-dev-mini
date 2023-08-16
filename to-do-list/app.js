const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('lodash');
// let items = ["Study", "Code", "Draw"];
// let studyItems = [];
// const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/todolistDB1', { useNewUrlParser: true, useUnifiedTopology: true });
// create schemas
const itemsSchema = {
    name: String
};
const listSchema = {
    name: String,
    items: [itemsSchema]
};
// create models
const List = mongoose.model('List', listSchema);
const Item = mongoose.model('Item', itemsSchema);
// create documents for the Item model
const item1 = new Item({
    name: 'Welcome to your todolist!'
});
const item2 = new Item({
    name: 'Hit the + button to add a new item.'
});
const item3 = new Item({
    name: '<-- Hit this to delete an item.'
});
const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs");
app.get('/', (req, res) => {
    let day = date.getDate();
    // if(today.getDay() == 0) {
        // res.send("<h1>Today is Sunday</h1>");
    // }
    // else {
        // res.write('Today is not Sunday');
        // res.write('<br>');
        // res.write('<a href="/">Back to home</a>');
        // res.send();
        // day = "Not Sunday";
        // res.sendFile(__dirname + '/index.html');
    // }
    Item.find({}, function (err, foundItems) {
        // console.log(foundItems);
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully saved default items to DB.');
                }
            });

        }
        res.render('list', { listTitle: "Today", newListItems: foundItems });

    });

});

app.get('/:customListName', (req, res) => {
    console.log(req.params.customListName);
    const customListName = _.capitalize(req.params.customListName);
    // create documents for the List model
    List.findOne({ name: customListName }, function (err, foundList) {
        if(!err){
            if(!foundList) {
                // create a new list if the list does not exist
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customListName);
            }
            else {
                // show an existing list
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items });

            }
        }
    });
});
app.post('/', (req, res) => {
    let itemName = req.body.newItem;
    let listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    console.log(req.body.list);
    if(req.body.list === 'Today') {
        item.save();
        res.redirect('/');
    }
    else {
        List.findOne({name: listName}, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }

});


app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === 'Today') {
        console.log(checkedItemId);
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(!err) {
                console.log('Successfully deleted checked item.');
                res.redirect('/');
            }
        });
    }
    else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkedItemId}}},
            function (err, foundList) {
                if(!err) {
                    res.redirect('/' + listName);
            }
        });
    }

});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});