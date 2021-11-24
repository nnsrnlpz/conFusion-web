import { Component, OnInit, Inject } from '@angular/core';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animations/app.animations';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})

export class MenuComponent implements OnInit {

  dishes!: Dish[]; 

  dish = Dish;

  errorMsg: string;

  //selectedDish!: Dish;
  
  constructor(private dishService: DishService,
    @Inject('BaseURL') public BaseURL: any) { }

  ngOnInit(): void {
    this.dishService.getDishes()
    //.then((dishes) => this.dishes = dishes);
    .subscribe((dishes) => this.dishes = dishes,
    errorMess => this.errorMsg = <any>errorMess);
  }

  /*onSelect(dish: Dish) {
    this.selectedDish = dish;
  }*/


}
