import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
//import { DISHES } from '../shared/dishes';
import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
//import { resolve } from 'dns';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    //return Promise.resolve(DISHES);
    //return new Promise(
      // => {
        // Simulate server latency with 2 second delay
        //setTimeout(() => resolve(DISHES), 200)
      //}
    //);
    return this.http.get<Dish[]>(baseURL + 'dishes');
  }

  getDish(id: string): Observable<Dish> {
    /*return new Promise(
      resolve=> {
      // Simulate server latency with 2 second delay
        setTimeout(() => resolve(DISHES.filter((dish) => (dish.id === id))[0]), 2000);
      }
    );*/
    return this.http.get<Dish>(baseURL + 'dishes/'+ id);
  }

  getFeaturedDish(): Observable<Dish> {
    /*return  new Promise(
      resolve=> {
      // Simulate server latency with 2 second delay
        setTimeout(() => resolve(DISHES.filter((dish) => dish.featured)[0]), 2000);
      }
    );*/
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]));
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)));
  }
  
}
