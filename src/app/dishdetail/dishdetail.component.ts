import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Dish } from "../shared/dish";
import { Comment } from "../shared/comment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { visibility, flyInOut, expand } from "../animation /app.animation";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],

  host: {
    "[@flyInOut] ": "true",
    style: "display : block"
  },
  animations: [flyInOut(), visibility(), expand()]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  dishcopy: Dish;
  comment: Comment;
  comments: Comment[] = [];
  visibility = "shown";

  @ViewChild("fform") commentFormDirective;

  formErrors = {
    author: "",
    comment: ""
  };

  validationMessages = {
    author: {
      required: "Name is required",
      minlength: " Name should be at least 2 characters long",
      maxlength: "Name cannot be more than 25 characters long"
    },
    comment: {
      required: "Comment is required"
    }
  };

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") private BaseURL
  ) {
    this.createForm();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      rating: 5,
      comment: ["", Validators.required]
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear previous
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + "";
          }
        }
      }
    }
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => {
      this.dishIds = dishIds;
    });
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = "hidden";
          return this.dishservice.getDish(params["id"]);
        })
      )

      .subscribe(
        dishes => {
          this.dish = dishes;
          this.dishcopy = dishes;
          this.setPrevNext(dishes.id);
          this.visibility = "shown";
        },
        errmess => (this.errMess = <any>errmess)
      );
  }
  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    const d = new Date();
    this.comment.date = d.toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy).subscribe(
      dish => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      errmess => {
        this.dish = null;
        this.dishcopy = null;
        this.errMess = <any>errmess;
      }
    );
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: "",
      value: 5,
      comment: ""
    });
  }
}
