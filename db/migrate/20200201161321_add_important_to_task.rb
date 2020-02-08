class AddImportantToTask < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :important, :boolean
  end
end
