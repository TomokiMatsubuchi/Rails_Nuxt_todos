Rails.application.routes.draw do
  namespace :v1 do
    resources :todos, only: %i[index create destroy]
    resources :users, only: %i[index create]
  end
end
