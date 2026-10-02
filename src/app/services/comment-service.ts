import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';

export interface Comment {
  id?: number;
  _id?: number;
  placeId: number;
  userId?: number | null;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly mockUrl = 'assets/mock-data/comments.json';

  constructor(private http: HttpClient) {}

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.mockUrl);
  }

  getCommentsByPlaceId(placeId: number): Observable<Comment[]> {
    return this.getAllComments().pipe(
      map((comments) =>
        comments.filter(
          (comment) => Number(comment.placeId) === Number(placeId)
        )
      )
    );
  }

  getCommentById(id: number): Observable<Comment> {
    return this.getAllComments().pipe(
      map((comments) => {
        const comment = comments.find(
          (comment) => Number(comment._id ?? comment.id) === Number(id)
        );

        if (!comment) {
          throw new Error(`Comment with id ${id} not found`);
        }

        return comment;
      })
    );
  }

  addComment(comment: Comment): Observable<Comment> {
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      _id: Date.now(),
    };

    return of(newComment);
  }

  updateComment(
    id: number,
    data: Partial<Comment>
  ): Observable<Comment> {
    return this.getAllComments().pipe(
      map((comments) => {
        const comment = comments.find(
          (comment) => Number(comment._id ?? comment.id) === Number(id)
        );

        if (!comment) {
          throw new Error(`Comment with id ${id} not found`);
        }

        return {
          ...comment,
          ...data,
          id: comment.id ?? comment._id,
          _id: comment._id ?? comment.id,
        };
      })
    );
  }

  deleteComment(id: number): Observable<void> {
    return of(void 0);
  }
}