import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { DISHES } from '../shared/dishes';
import { visibility } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility()
  ]
})

export class DishdetailComponent implements OnInit {

  @ViewChild('fform', {static:false}) commentFormDirective!: NgForm;

  dish!: Dish;
  dishIds!: string[];
  prev: string;
  next: string;
  errMess: string;
  
  commentForm: FormGroup;
  comment: Comment;

  dishcopy: Dish;

  visibility = 'shown';

  formErrors: any = {
    'author': '',
    'rating': '',
    'comment': ''
  };

  validationMessages: any = {
    'author': {
      'required': 'Author is required',
      'minlength': 'Author must be at least 2 characters long'
    },
    'comment': {
      'required': 'Comment is required',
      'maxlength': 'Comment cannot be more than 200 characters'
    }
  };

  constructor(private dishService: DishService, 
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: any) { 
      this.createForm();
    }

  ngOnInit(): void {
    //const id = this.route.snapshot.params['id'];
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5'],
      comment: ['', [Validators.required, Validators.maxLength(200)]] 
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    }, 
    errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }

    const form = this.commentForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }
}
