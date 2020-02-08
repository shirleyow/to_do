class Api::V1::TasksController < ApplicationController
  def index3
    task = Task.all.order(important: :desc, deadline: :asc)
    render json: task
  end
  
  def index2
	  task = Task.all.order(deadline: :asc)
	  render json: task
  end
  
  def index
	  task = Task.all.order(updated_at: :desc)
	  render json: task
  end

  def create
    task = Task.create!(task_params)
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def update
    task = current_user_tasks.find(params[:id])
    if task.update(task_params)
      render json: task
    else
      render json: task.errors
    end
  end

  def destroy
    task = current_user_tasks.find(params[:id])
    task.destroy
    render json: { message: 'Task deleted.' }
  end
  
  private
  def task_params
	  helpers.include_id(params.permit(:title, :description, :deadline, :tags, :completed, :id, :important, :user_id))
  end
  
  def task
	  @task ||= Task.find(params[:id])
  end

  def current_user_tasks
    helpers.current_user_tasks
  end
end
