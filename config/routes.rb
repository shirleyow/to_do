Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'tasks/index'
      get 'tasks/index2'
      get 'tasks/index3'
      post 'tasks/create'
	    put 'tasks/update'
      put 'tasks/update/:id', to: 'tasks#update'
      delete '/destroy/:id', to: 'tasks#destroy'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
