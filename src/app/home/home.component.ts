import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})

export class HomeComponent implements OnInit {

  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL: any) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe((dish) => this.dish = dish,
      disherrmess => this.dishErrMess = <any>disherrmess);
    
    this.promotionservice.getFeaturedPromotion()
      .subscribe((promotionservice) => this.promotion = promotionservice,
      promerrmess => this.promotionErrMess = <any>promerrmess);
    
    this.leaderService.getFeaturedLeader()
      .subscribe((leaderService) => this.leader = leaderService,
      leadererrmess => this.leaderErrMess = <any>leadererrmess);
  }

}
