class ApplicationController < ActionController::Base
    before_action :check_user_id_presence, except: :welcome
    def welcome 
        helpers.new_user
    end

    private
    def check_user_id_presence
        if helpers.new_user.nil?
            cookies.encrypted.permanent[:user_id] = SecureRandom.hex
            redirect_to root_path
        end
    end
end
