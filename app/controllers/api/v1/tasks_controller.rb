class Api::V1::TasksController < ApplicationController
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
  
  def edit
    task = Task.find(params[:id])
  end

  def update
    task = Task.find(params[:id])
    if task.update_attributes(task_params)
      render json: task
    else
      render 'edit'
    end
  end

  def destroy
	task&.destroy
	render json: { message: 'Task deleted.' }
  end
  
  private
  def task_params
	params.permit(:title, :description, :deadline, :tags)
  end
  
  def task
	@task ||= Task.find(params[:id])
  end
end
