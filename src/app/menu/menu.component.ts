import { Component, OnInit, Inject } from '@angular/core';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
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
