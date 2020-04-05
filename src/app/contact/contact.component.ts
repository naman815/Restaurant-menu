import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import { flyInOut, expand } from "../animation /app.animation";
import { FeedbackService } from "../services/feedback.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    "[@flyInOut] ": "true",
    style: "display : block",
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback;
  errMess: string;
  feedbacks = [];
  contactType = ContactType;
  flag: boolean;
  spin: boolean;
  flag1: boolean;

  @ViewChild("fform") feedbackFormDirective;

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };

  validationMessages = {
    firstname: {
      required: "First name is required",
      minlength: " First name should be at least 2 characters long",
      maxlength: "First name cannot be more than 25 characters long",
    },
    lastname: {
      required: "Last name is required",
      minlength: " Last name should be at least 2 characters long",
      maxlength: "Last name cannot be more than 25 characters long",
    },
    telnum: {
      required: "Tel. number is required",
      pattern: "Tel. number must contain only numbers",
    },
    email: {
      required: "Email number is required",
      email: "Email not in valid format",
    },
  };
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: "",
    });
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
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

  onSubmit() {
    this.flag = true;
    this.spin = true;

    this.feedback = this.feedbackForm.value;
    this.feedbackCopy = this.feedback;
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      (feed) => {
        this.spin = false;
        this.flag1 = true;
        setTimeout((feed) => {
          this.flag = false;
          this.flag1 = false;
        }, 5000);

        this.feedbacks.push(feed);
      },
      (errmess) => {
        this.feedback = null;
        this.feedbackCopy = null;
        this.errMess = <any>errmess;
      }
    );

    this.feedbackFormDirective.resetForm();
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: 0,
      email: "",
      agree: false,
      contacttype: "None",
      message: "",
    });
  }
}
