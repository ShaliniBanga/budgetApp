// 1. for ui control
var UIcontroller = (function(){
    
    //variables
    var type, description, amount;
    //1. Create the DOM elements variable
    
    
    //2. Make it public to access everywhere
    
    
    //3. Read the data from UI + 
    //4. Make the same public to make it access from anywhere
    
    function formatNumber(num, type){
        	num = Math.abs(num);
            num = num.toFixed(2);
            console.log(num);
            var numsplit = num.split('.');
            console.log(numsplit);
            var decimal = numsplit[0];
            if (decimal.length > 3){
                var printNum = decimal.substr(0,decimal.length - 3)+","+decimal.substr(decimal.length - 3,decimal.length - 1)+"."+numsplit[1];
                //console.log((type === 'exp' ? '-' : '+') + printNum);
                return (type === 'exp' ? '-' : '+') + printNum;
            }
        else{
            return (type === 'exp' ? '-' : '+') + num;
            
        }
            

        }
    return{
        addItem: function(){
            //This is a function
            return{
                type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                amount : parseFloat(document.querySelector('.add__value').value)
            };
            
        },
        // Updating the UI
        addtoUI: function(obj, type){
            if (type === 'inc'){
                var elementSection = document.querySelector(".income__list");
                var html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                var elementSection = document.querySelector(".expenses__list");
                var html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replaving the actual values
            var newHTML = html.replace('%id%',obj.id);
            var newHTML = newHTML.replace('%description%',obj.description);
            var newHTML = newHTML.replace('%amount%',formatNumber(obj.amount,type));
            
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
        },
        

        updateBudgetUI: function(ob){
            var signInc,signExp,signBudget;
            //ob.totalinc >= 0 ? signInc = "+" : signInc = "-";
            //ob.totalexp >= 0 ? signExp = "-" : signExp = "+";
            document.querySelector('.budget__income--value').textContent = formatNumber(ob.totalinc,'inc');
            document.querySelector('.budget__expenses--value').textContent = formatNumber(ob.totalexp,'exp');
            if (ob.budget > 0){
             document.querySelector('.budget__value').textContent = formatNumber(ob.budget,'inc');   
            }
            else document.querySelector('.budget__value').textContent = formatNumber(ob.budget,'exp');
            
            if(ob.percentage >= 0){
                document.querySelector('.budget__expenses--percentage').textContent = ob.percentage + "%";
            }
        },
        
            

        deleteFromUI: function(delID){
            
            var parentDel = document.getElementById(delID);
            parentDel.parentNode.removeChild(parentDel);

        },
        
        updatePercentage: function(arr){
            var node=document.querySelectorAll('.item__percentage');
            var nodearray=Array.prototype.slice.call(node);
            nodearray.forEach(function(cur,index){
                cur.textContent=arr[index] + " %";
            })
        },
        
        updateMonth : function(){
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            //console.log(month.getMonth());
            var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            var displayMonth = m[month];
            document.querySelector('.budget__title--month').textContent=displayMonth + " " + year;
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
    
    Expense.prototype.percentageExpense=function(){
        if(data.totals.inc>0){
        this.percentage = Math.round((this.amount/data.totals.inc)*100);
        }
        else 
            {
                this.percentage= -1;
            }
        return this.percentage;
            
    }
    //3. Data Structure to keep a track of the changes
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
            budget: 0,
            percentage : -1
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
        },
        
        updateBudget: function(type)
        {
            var incsum=0;
            var expsum=0;
            if(type==='inc')
                {
                    data.allItems[type].forEach(function(current){
                        incsum+=current.amount;
                        
                        console.log(incsum);
                        console.log(data.totals[type]);
                    })
                    data.totals[type]=incsum;
                }
            
            else if (type=='exp'){
                data.allItems[type].forEach(function(current){;
                expsum+=current.amount;
                
                console.log(expsum);
                console.log(data.totals[type]);
                                                              
                                                              
            })
                data.totals[type]=expsum;
        }
            data.totals.budget = data.totals.inc-data.totals.exp;
            if (data.totals.inc > 0)
            data.totals.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            else
            {data.totals.percentage = -1};
            //console.log(data.totals.percentage);
            
    },

        
        
        getBudget: function(){
            return{
                totalinc:data.totals.inc,
                totalexp: data.totals.exp,
                budget: data.totals.budget,
                percentage: data.totals.percentage
                }
            },

        
        
        deleteItems: function(type, id){
            
            var ID = data.allItems[type].map(function(current){
                return current.id;
            })
            var delID = ID.indexOf(id);
            data.allItems[type].splice(delID,1);
            console.log(data.allItems[type]);

        },
        
        PercentageCalc: function(){
            
            var newarray=data.allItems.exp.map(function(current){
            return current.percentageExpense();
            
                
            })
            return newarray;
            
        }
        
        
    }
    
    
})();


//3. global controller for linking the above two modules
var Globalcontroller = (function(bdgtController,uiController){
    // allSetup function starting the interaction
    
    function allSetUp(){
            //var checkDesc = document.querySelector('.add__description').value;
            //var checkVal = document.querySelector('.add__value').value;
            document.querySelector('.add__type').addEventListener('change',function(){
                document.querySelector('.add__type').classList.toggle('red-focus');
                document.querySelector('.add__description').classList.toggle('red-focus');
                document.querySelector('.add__value').classList.toggle('red-focus');
                document.querySelector('.add__btn').classList.toggle('red');


            })
            document.querySelector('.add__btn').addEventListener('click',ctrlAdditem);
            document.addEventListener('keypress',function(Event){
            if (Event.keyCode === 13 || Event.which === 13)
            ctrlAdditem();
            
            })
            document.querySelector('.container').addEventListener('click',ctrlDelItem); 
    }
            
            

    
            
        //5. clickEvent function
        function ctrlAdditem(){
        //2. Extract data from UI
        
       var addedItem = uiController.addItem();
            if(addedItem.description !="" && addedItem.amount>0 && !isNaN(addedItem.amount))
                {
        
        
        //3. Store the new Data
        var newData = bdgtController.updateData(addedItem.type,addedItem.description,addedItem.amount);
        //console.log(newData);
        
        
        //4. Update the User Interface with Income and Expense
        uiController.addtoUI(newData, addedItem.type);
        
            
        // CLearing the Input Fields
        uiController.clearFields();
        
        //Updating the income and expense and the final budget
        bdgtController.updateBudget(addedItem.type);
        
        //Updating the budget in UI
        var updateBudget = bdgtController.getBudget();
                    
        uiController.updateBudgetUI(updateBudget);
                    
        //Calculating the individual percentage ans storing in an array
        var allPerc=bdgtController.PercentageCalc();
        console.log(allPerc);
                    
        // display the individula percentages in UI
        uiController.updatePercentage(allPerc);
        
                }
        
    }
    
    var ctrlDelItem = function(Event){
    var eleTarget = Event.target.parentNode.parentNode.parentNode.parentNode.id;
    var arrEle = eleTarget.split("-");
    var type = arrEle[0];
    var value = parseInt(arrEle[1]);
    console.log(type, value);
        
    
    //1. create a function for deletion from backend
    bdgtController.deleteItems(type,value);
        
    //2. create a funtion to delete from UI
    uiController.deleteFromUI(eleTarget);
        
    //3. update the budget accordingly from backend
    bdgtController.updateBudget(type);   
        
    //4. display the updated budget
    var editBudget = bdgtController.getBudget();
    console.log(editBudget);
    uiController.updateBudgetUI(editBudget);
        
    //Calculating the individual percentage ans storing in an array
        var allPerc=bdgtController.PercentageCalc();
        console.log(allPerc);
                    
    // display the individula percentages in UI
        uiController.updatePercentage(allPerc);
        
    
        
    }

    
    
      return {
        // starting the app
        init: function(){
            console.log("Application is ready to be used!");
            document.querySelector('.budget__income--value').textContent = 0;
            document.querySelector('.budget__expenses--value').textContent = 0;
            document.querySelector('.budget__value').textContent = 0;
            document.querySelector('.budget__expenses--percentage').textContent = -1 + " %";
            uiController.updateMonth();
            allSetUp();

        } 
      }
    
    
})(Budgetcontroller,UIcontroller);
Globalcontroller.init();
