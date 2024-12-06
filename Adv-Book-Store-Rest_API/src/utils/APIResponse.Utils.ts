export class APIResponse {
  public status: number;
  public success: boolean;
  public message: string;
  public data?: any;

  constructor(
    status: number = 200,
    success: boolean = true,
    message: string = 'ok',
    data?: any
  ) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
