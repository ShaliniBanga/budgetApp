// 1. for ui control
var UIcontroller = (function(){
    
    //variables
    var type, description, amount;
    //1. Create the DOM elements variable
    
    
    //2. Make it public to access everywhere
    
    
    //3. Read the data from UI + 
    //4. Make the same public to make it access from anywhere
    return{
        addItem: function(){
            //This is a function
            return{
                type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                amount : document.querySelector('.add__value').value
            };
            
        },
        // Updating the UI
        addtoUI: function(obj, type){
            if (type === 'inc'){
                var elementSection = document.querySelector(".income__list");
                var html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                var elementSection = document.querySelector(".expenses__list");
                var html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replaving the actual values
            var newHTML = html.replace('%id%',obj.id);
            var newHTML = newHTML.replace('%description%',obj.description);
            var newHTML = newHTML.replace('%amount%',obj.amount);
            
            // adding it back to the DOM
            elementSection.insertAdjacentHTML('beforeend', newHTML);
            
            
        },
        
        clearFields: function(){
            
            var eleList = document.querySelectorAll('.add__description, .add__value');
            //console.log(eleList);
            var eleArr = Array.prototype.slice.call(eleList);
            //console.log(eleArr);
            eleArr.forEach(function(current){
                current.value = "";
            })
            eleArr[0].focus();
        }
        
            
    }
    
    
    
    
    
})();


//2. for db control
var Budgetcontroller = (function(){
    //1. expense object
    var Expense = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    };
    
    //2. Income object
    var Income = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    };
    //3. Data Structure to keep a track of the changes
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return{
        updateData: function(type, description, amount){
            var ID;
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else ID = 1;
            if (type === 'inc'){
                var newItem = new Income(ID,description, amount);
                data.allItems[type].push(newItem);
                console.log(data.allItems.inc);
            }
            else{
                var newItem = new Expense(ID, description, amount);
                data.allItems[type].push(newItem);
                console.log(data.allItems.exp);
            }
            return newItem;
        }
    }
    
    
})();


//3. global controller for linking the above two modules
var Globalcontroller = (function(bdgtController,uiController){
    // allSetup function starting the interaction
    
    function allSetUp(){
            //var checkDesc = document.querySelector('.add__description').value;
            //var checkVal = document.querySelector('.add__value').value;
            document.querySelector('.add__btn').addEventListener('click',ctrlAdditem);
            document.addEventListener('keypress',function(Event){
            if (Event.keyCode === 13 || Event.which === 13)
            ctrlAdditem();
    })  
            
            
        }
            
    return {
        // starting the app
        init: function(){
            console.log("Application is ready to be used!");
            allSetUp();
        }
        //this is a random comment
        
    }
    
        //5. clickEvent function
        function ctrlAdditem(){
        //2. Extract data from UI
        
       var addedItem = uiController.addItem();
        //console.log(addedItem);
        
        //3. Store the new Data
        var newData = bdgtController.updateData(addedItem.type,addedItem.description,addedItem.amount);
        //console.log(newData);
        
        //4. Update the User Interface with Income and Expense
        uiController.addtoUI(newData, addedItem.type);
            
        // CLearing the Input Fields
        uiController.clearFields();
        
    }
    
})(Budgetcontroller,UIcontroller);
Globalcontroller.init();
