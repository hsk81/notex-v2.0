# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)
$ext_path = File.join('..', '..', '..', '../ext')

# Load the extjs framework automatically.
load File.join($ext_path, 'resources', 'themes')
$images_dir = File.join("images")

# Compass configurations
sass_path = dir
css_path = File.join("..", "..", "..", "resources", "theme")
output_style = :compressed
environment = :production

# Disable warnings during sass compilation about missing paths to images
# due to images being placed in build output directory, not source working directory
disable_warnings = true

module AppSassExtensions
  module SassExtensions
    module Functions
      module Utils
        # Returns a background-image property for a specified images for the theme
        def theme_image(theme, path, without_url = false, relative = false)
          path = path.value
          theme = theme.value
          without_url = (without_url.class == FalseClass) ? without_url : without_url.value
          
          relative_path = "../images/"
          
          if relative
            if relative.class == Sass::Script::String
              relative_path = relative.value
              relative = true
            elsif relative.class == FalseClass || relative.class == TrueClass
              relative = relative
            else
              relative = relative.value
            end
          else
            relative = false
          end
          
          if relative
            image_path = File.join(relative_path, theme, path)
          else
			# this needs to override the default impl by checking for images at the $images_dir
			# location
            images_path = File.join($images_dir)
            image_path = File.join(images_path, path)
          end
          
          if !without_url
            url = "url('#{image_path}')"
          else
            url = "#{image_path}"
          end
          
          Sass::Script::String.new(url)
        end
      end
    end
  end
end

module Sass::Script::Functions
  include AppSassExtensions::SassExtensions::Functions::Utils
end
