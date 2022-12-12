const button = document.getElementById('myButton');
const show_button = document.getElementById("show_reviews")

show_button.addEventListener('click', function(e) {fetch('/show', {method: 'GET'})
  .then(function(res) {
  if(res.ok) return res.json();
  throw new Error('Request failed.');
  })
  .then(function(reviews) {
          
    let review_cont = document.getElementById("reviews_container");
    console.log(reviews.length)
    for (let i = 0; i < reviews.length; i++) {

      let record = document.createElement("div");
      record.className = "reviews";

      let filename = document.createElement("h");
      let rate = document.createElement("h");
      let review = document.createElement("h");

      filename.innerHTML = "Имя файла: " +  reviews[i].filename;
      rate.innerHTML = "Оценка: " + reviews[i].rate;
      review.innerHTML = "Отзыв: " + reviews[i].review;

      record.append(filename);
      record.append(document.createElement("br"));
      record.append(rate);
      record.append(document.createElement("br"));
      record.append(review);
      record.append(document.createElement("br"));
      record.append(document.createElement("br"));

      review_cont.append(record);
    }
  })
})

button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/clicked', {method: 'GET'})
  .then(function(res) {
  if(res.ok) return res.json();
  throw new Error('Request failed.');
  })
  .then(function(data) {

  if ((document.getElementsByName("iframe").length == 0)) {
    let iframe = document.createElement("iframe");
    iframe.name = "iframe";
    iframe.id = "iframe_id";
    iframe.height = 400;
    iframe.width = 400;
    let cont1 = document.getElementById('cont1');

    cont1.append(iframe);
  }

  let cont = document.getElementById('container');
  let ul = document.createElement("ul");

  for (let i = 0; i < data.length; i++) {
    let li = document.createElement("li");
    let a = document.createElement('a');
    let linkText = document.createTextNode("Работа " + i);
    a.title = "a";
    a.href = window.location.href + 'documents/' + data[i].filename;
    a.target = iframe.name;
    a.appendChild(linkText);
    a.class = "links";
    a.onclick = function() {
      if (document.getElementById("select") == null) {

        let label = document.createElement("label")
        label.innerHTML = "Поставьте оценку";
        label.id = "label_for_select";
        label.for = "select";

        cont.append(label);

        let select = document.createElement("select");
        select.name = "rates";
        select.id = "select";
        cont.append(select);
        let arr = ["1", "2", "3", "4", "5"];
        for (let i = 0; i < 5; i++) {
          let option = document.createElement("option");
          option.value = arr[i];
          option.text = arr[i];
          select.appendChild(option);
        }
      }
      
      if (document.getElementById("text_review") == null) {
        let text_label = document.createElement("label");
        text_label.innerHTML = "Напишите отзыв";
        text_label.id = "text_id";

        cont.append(text_label);

        let field = document.createElement("textarea");
        field.id = "text_review";

        cont.append(field);
      }

      if (document.getElementById("submit_button") == null) {
        let submit = document.createElement("button");

        submit.id = "submit_button";
        submit.innerHTML = "Отправить";

        submit.addEventListener('click', function(e) {

          fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "rate": document.getElementById("select").value,
                                   "review": document.getElementById("text_review").value,
                                   "filename": document.getElementById("iframe_id").contentWindow.location.href})
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))

        })

        cont.append(submit)
      }
    }

  li.appendChild(a);
  ul.appendChild(li);
  }
  cont.append(ul);
  })

  .catch(function(error) {
  console.log(error);
  });
});