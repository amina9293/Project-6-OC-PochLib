var H2 = document.getElementById("NewBook");// utiliser add button
var TitleData;// utiliser ds search bar function search 
var AuthorData;// utiliser ds search bar function search
var response;// utliser resulat de recherche api reponse
var savedBooks = new Set(); //set storé les livres
var maPochListe = document.getElementById("maPochListe"); // endroit ou se display les book
var book = {}; 
var poshListSet = []; //array of saved books

//Container 
var pochListContainerDiv = document.createElement('div');
pochListContainerDiv.innerHTML = 
` <div id="pochListContainer" class="container"></div>`
maPochListe.after(pochListContainerDiv);
var pochListContainer =document.getElementById('pochListContainer');

//Add a "Add a book" button
var addBookbtn = document.createElement("div");
addBookbtn.innerHTML = 
`<div id= addbookdiv class="btn__addBook">
<button onclick="addAbook()" id="addbookbtn" class="btn ">Ajouter un livre</button></br></br>
</div>`;
H2.after(addBookbtn);
var addBookD = document.getElementById("addbookdiv");

//div search result 
var searchResult = document.createElement('div'); 
addBookD.after(searchResult);

var container;

// error message 
var errorMessageDiv = document.createElement('div');
errorMessageDiv.innerHTML = searchResult.innerHTML += `<div class="errorMessage"></div>`;
var SearchForm;


if(sessionStorage.getItem('savedBooks')){
   poshListSet = JSON.parse(sessionStorage.getItem('savedBooks'));

    poshList();

}
console.log(sessionStorage.getItem("savedBooks"));

//When the user clicks on the add a book button , the add book button dissapears and a search form appears
function addAbook(){
    //var SearchForm = document.createElement("form");
    addBookD.innerHTML = `<form class="form" id="SearchForm"><div id="searcharea">
    <label for="titleNameField">Titre du livre<br/></label>
    <input class="search" id="titleNameField" type="search" name="titleNameField"><br/>
    <label for="AuthorNameField">Auteur<br/></label>
    <input class="search" id="AuthorNameField"type="search" name="AuthorNameField" ><br/>
    <button type="button"  class="btn searchButton" onclick="search()">Rechercher</button></br>
    <button type="button"  onclick="window.location.href='index.html';" class="btn cancelButton" id="cancelButton" >Annuler</button>
    </div></form>`;
    
    SearchForm = document.getElementById("SearchForm");
    SearchForm.after(errorMessageDiv);
}


//Research a book 

function search(){
    TitleData= document.getElementById("titleNameField").value;
    AuthorData = document.getElementById("AuthorNameField").value;
    
    if(TitleData === '' || AuthorData === ''){
       
       searchResult.innerHTML += `<p class="errorMessage"> Vous devez fournir une valeur aux deux champs pour lancer la recherche !</p>`;
        

    }else{


    var request = new XMLHttpRequest();
    request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=intitle:${TitleData}+inauthor:${AuthorData}&key=AIzaSyCyE-Acth2xh1OUWuTFL2nO7WlAiZXuaro`)
    request.send();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            response = JSON.parse(this.responseText);
            console.log(response);
            searchResult.innerHTML = 
            `<hr>
            <div><h2 id="searchResult">Résultat de recherche</br></br></h2></div>
            <div id="resultconteneur" class="container"></div>`
            container = document.getElementById('resultconteneur');

            if(response.totalItems === 0){
                console.log("no books found");
                searchResult.innerHTML += 
                `<p class="errorMessage">Aucun livre n'a été trouvé!</p>`
                
                
            }else{

                for (i = 0; i < response.items.length; i++) {
                    
                        if(response.items[i].volumeInfo.imageLinks === undefined){
                             image = "unavailable.png" ;
                    }else{
                        image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                    }
                    if(response.items[i].volumeInfo.description === undefined){
                         description = "Information manquante" ;
                }else{
                    description = response.items[i].volumeInfo.description.substr(0,200);
                }
                title = response.items[i].volumeInfo.title;
                author = response.items[i].volumeInfo.authors;
                bookId = response.items[i].id;
                

                    container.innerHTML += 
                   `<div class="container__result"><p>
                    <p><a  onclick="bookmark('${bookId}','${author}', '${title}','${description}','${image}')"><i class="far fa-bookmark"></i></a></p>
                    <p><strong>Titre: ${title}</strong> </p>
                    <p><strong>Id: ${bookId}</strong></p>
                    <p>Auteur: ${author}</p>
                    <p>${description}</p>
                    <p><img id="img" src="${image}" ></p>
				    </p></div>`;


                  }
                  
            }
        }
    }
}

}


function bookmark(bookId, author, title, description, image){
    

     book = {
        id: bookId,
        title: title,
        author: author,
        description: description,
        image: image,

    }
    

    if(savedBooks.has(bookId)){
        
        console.log('ancien ds la list');
        errorMessageDiv.innerHTML = `<p class="errorMessage"> Vous ne pouvez ajouter deux fois le même livre!</p>`;
        

    }else{
        errorMessageDiv.innerHTML = "";
        savedBooks.add(book.id);
        poshListSet.push(book);
        console.log('nouveau ds la liste');
        sessionStorage.setItem('savedBooks', JSON.stringify(poshListSet));
    }

poshList();
console.log(poshListSet.length);
console.log(savedBooks.size);
}

function deleteBook(bookid) {
   savedBooks.delete(bookid);
   poshListSet = poshListSet.filter(book => book.id !== bookid);
    
    sessionStorage.setItem('savedBooks', JSON.stringify(poshListSet));
    poshList();
    console.log(poshListSet.length);
    console.log(savedBooks.size);
    
  }
  
function poshList(){
    pochListContainer.innerHTML = "";
    for(i = 0; i < poshListSet.length ; i++) {

        pochListContainer.innerHTML += 
        `<div id="containerPL" class="container__result"><p>
        <p><a onclick="deleteBook('${poshListSet[i].id}')"><i class="fas fa-trash-alt"></i></a></p>
        <p><strong>Titre:</strong> ${poshListSet[i].title} </p>
        <p><strong>Id:</strong>${poshListSet[i].id}</p>
        <p>Auteur: ${poshListSet[i].author}</p>
        <p>${poshListSet[i].description}</p>
        <p><img id="img"  src="${poshListSet[i].image}"></p>
        </p></div>`;

        savedBooks.add(poshListSet[i].id);
    }

}

console.log(savedBooks.size);
console.log(poshListSet.length);