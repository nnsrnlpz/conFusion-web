import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animations';
import { Params, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform', {static:false}) feedbackFormDirective!: NgForm;

  formErrors: any = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages: any = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters.'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name cannot be more than 25 characters.'
    },
    'telnum': {
      'required': 'Telephone number is required.',
      'pattern': 'Telephone number can only contain digits and must have a lenght of 9.'
    },
    'email': {
      'required': 'Email is requered.',
      'email': 'Email not in valid format.'
    }
  };

  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  feedbackCopy!: Feedback;
  errMess: string;
  submitted: boolean = false;
  sent: boolean = false;

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    @Inject('BaseURL') public BaseURL: any) {
    this.createForm();
   }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params: Params) => this.feedbackService.submitFeedback(params['feedback'])))
        .subscribe(feedback => {this.feedback = feedback; this.feedbackCopy = feedback;},
          errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: [0, [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // Used to reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous errors
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit() {

    this.sent = true;

    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    this.feedbackCopy = this.feedback;

    this.feedbackService.submitFeedback(this.feedbackCopy)
      .subscribe(feedback => {
        this.feedback = feedback; this.feedbackCopy = feedback; this.submitted = true;
        setTimeout(()=>{                           
          this.submitted = false;
     }, 3000);;
      },
      errmess => { this.feedback = null; this.feedbackCopy = null; this.errMess = <any>errmess; });

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
