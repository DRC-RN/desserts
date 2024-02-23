import { computed, inject } from '@angular/core';
import { DessertIdToRatingMap, RatingService } from './rating.service';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { toRated } from './to-rated';
import { withDataService } from './data-service.feature';

export const DessertStore = signalStore(
  { providedIn: 'root' },

  withDataService(),

  //
  // Ratings-realated parts have been moved down
  // to make refactoring easier
  //
  withState({
    ratings: {} as DessertIdToRatingMap,
  }),
  withComputed((store) => ({
    ratedDesserts: computed(() => toRated(store.desserts(), store.ratings())),
  })),
  withMethods((store, ratingService = inject(RatingService)) => ({
    async loadRatings(): Promise<void> {
      const ratings = await ratingService.loadExpertRatings();
      patchState(store, { ratings });
    },
    updateRating(id: number, rating: number): void {
      patchState(store, (state) => ({
        ratings: {
          ...state.ratings,
          [id]: rating,
        },
      }));
    },
  })),
);
