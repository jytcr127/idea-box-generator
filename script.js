let $ideaTitle = $("#title-input");
let $ideaBody = $("#body-input");
let $saveButton = $("#save-button");
let $searchInput = $("#search-input");
let $userIdeas = $("#user-ideas");
let $superbFilter = $("#superb-filter-button");
let $greatFilter = $("#great-filter-button");
let $decentFilter = $("#decent-filter-button");

$(function() {

  function Idea (title, body, id, quality) {
    this.title = title;
    this.body = body;
    this.id = id || Date.now();
    this.quality = quality || "decent";
  }

  Idea.prototype.toHTML = function () {
    return $(`
      <section class='each-idea-card composition-photo' id=${this.id}>
        <header>
            <h3 contenteditable='true' class='content'>${this.title}</h3>
            <figure class='delete' id='delete'></figure>
        </header>
        <p contenteditable='true' class='content'>${this.body}</p>
        <footer>
          <figure class='upvote' id='upvote'></figure>
          <figure class='downvote' id='downvote'></figure>
          <h6 class='content'><span class='designation-quality'>quality</span>: ${this.quality}</h6>
        </footer><hr class = 'bottom-line'>
      </section>
    `);
  };// This is code for each idea card that is generated

  Idea.prototype.remove = function () {
    ideaManager.remove(this.id);
  };

  let ideaManager = {
    ideaArray: [],
    add: function (title, body) {
      this.ideaArray.push(new Idea(title, body));
      this.store();
    },

    find: function (id) {
      id = parseInt(id);
      return this.ideaArray.find(function (idea) {
        return idea.id === id;
      });
    },


    render: function () {
      $userIdeas.html("");
      for (let i = 0; i < this.ideaArray.length; i++) {
        let idea = this.ideaArray[i];
        $userIdeas.prepend(idea.toHTML());
      }
    },

    store: function () {
      localStorage.setItem("ideas", JSON.stringify(this.ideaArray));
      this.render();
    },

    retrieve: function () {
      let retrievedIdeas = JSON.parse(localStorage.getItem("ideas"));
      if (retrievedIdeas) {
        for (let i = 0; i < retrievedIdeas.length; i++) {
          let idea = retrievedIdeas[i];
          this.ideaArray.push(new Idea(idea.title, idea.body, idea.id, idea.quality));
        }
      }
    },

    remove: function (id) {
      id2 = parseInt(id);
      this.ideaArray = this.ideaArray.filter(function (idea) {
        return idea.id !== id;
      });
      this.store();
    },
  };

  function clearInputFields() {
    $ideaTitle.val('');
    $ideaBody.val('');
  }

  function addUserInputToIdeaManager() {
    ideaManager.add($ideaTitle.val(), $ideaBody.val());
  }

  $saveButton.on("click", function (e) {
    addUserInputToIdeaManager();
    clearInputFields();
  });

  $ideaBody.on("keyup", function (key) {
    if (key.which === 13) {
      addUserInputToIdeaManager();
      clearInputFields();
    }
  });

  $userIdeas.on("click", ".delete, .upvote, .downvote, .content", function (event) {
    let id = $(this).closest(".each-idea-card").attr("id");
    let find = ideaManager.find(id);
    
    if (this.id === "upvote") {
      find.upvote();
     } else if (this.id === "downvote") {
      find.downvote();
     } else if (this.id === "delete") {
       $('.bottom-line').fadeOut(500);
      $('.downvote').fadeOut(500);
       $('.upvote').fadeOut(500);
       $('.content').fadeOut(500);
       $(this).parent().fadeOut(500, function() {
        find.remove();
       })
    }
  });

  Idea.prototype.upvote = function () {
    let quality = this.quality;
    if (quality === "decent") {
      this.quality = "great";
      } else if (quality === "great") {
      this.quality = "superb";
    }
    ideaManager.store();
  };

  Idea.prototype.downvote = function () {
    let quality = this.quality;
    if (quality === "superb") {
      this.quality = "great";
      } else if (quality === "great") {
      this.quality = "decent";
    }
    ideaManager.store();
  };

  Idea.prototype.saveEditableTitle = function (target) {
    this.title = target;
    ideaManager.store();
  };

  Idea.prototype.saveEditableBody = function (target) {
    this.body = target;
    ideaManager.store();
  };

  $searchInput.on("keyup", function () {
    let search = $(this).val();
    $("h3:contains('" + search + "')").closest(".each-idea-card").show();
    $("h3:not(:contains('" + search + "'))").closest(".each-idea-card").fadeOut(500);
  });

  $superbFilter.on('click', function() {
    let filter = 'superb';
    $("h6:contains('" + filter + "')").closest(".each-idea-card").show();
    $("h6:not(:contains('" + filter + "'))").closest(".each-idea-card").hide();
  })

  $greatFilter.on('click', function() {
    let filter = 'great';
    $("h6:contains('" + filter + "')").closest(".each-idea-card").show();
    $("h6:not(:contains('" + filter + "'))").closest(".each-idea-card").hide();
  })

  $decentFilter.on('click', function() {
    let filter = 'decent';
    $("h6:contains('" + filter + "')").closest(".each-idea-card").show();
    $("h6:not(:contains('" + filter + "'))").closest(".each-idea-card").hide();
  })

  ideaManager.retrieve();
  ideaManager.render();
});

