function baseiframe(widget_id, url, skin, parameters)
{
    self = this
    
    // Initialization
    
    self.parameters = parameters;
    
    var callbacks = []
    
    var monitored_entities = []
    
    // Call the parent constructor to get things moving
    
    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks);

    // Set the url
    
    if ("url_list" in parameters || "img_list" in parameters || "entity_picture" in parameters)
    {
        self.index = 0;
        refresh_frame(self)
    }
    
    function refresh_frame(self)
    {
        if ("url_list" in self.parameters)
        {
            self.set_field(self, "frame_src", self.parameters.url_list[self.index]);
            self.set_field(self, "img_src", "/images/Blank.gif");
            size = self.parameters.url_list.length
        }
       else if ("img_list" in self.parameters)
        {
            var url = self.parameters.img_list[self.index];
            if (url.indexOf('?') > -1)
            {
                url = url + "&time=" + Math.floor((new Date).getTime()/1000);
            }
            else
            {
                url = url + "?time=" + Math.floor((new Date).getTime()/1000);
            }
            var imgUrl = getImgObjectUrl(self, url);
            self.set_field(self, "img_src", imgUrl);
            size = self.parameters.img_list.length
        }
        else if ("entity_picture" in self.parameters)
        {
            var url = self.parameters.entity_picture;
            if (url.indexOf('?') > -1)
            {
                url = url + "&time=" + Math.floor((new Date).getTime()/1000);
            }
            else
            {
                url = url + "?time=" + Math.floor((new Date).getTime()/1000);
            }
            var imgUrl = getImgObjectUrl(self, url);
            self.set_field(self, "img_src", imgUrl);
            size = 1
        }
        
        if ("refresh" in self.parameters)
        {
            self.index = self.index + 1;
            if (self.index == size)
            {
                self.index = 0;
            }
            setTimeout(function() {refresh_frame(self)}, self.parameters.refresh * 1000);
        }
    }
    
    function getImgObjectUrl(self, url){
        var auth = ("token" in self.parameters) ? {'Authorization': 'Bearer ' + self.parameters.token} : {}
        $.get({url: url,  headers: auth , cache: false, xhrFields: {responseType: 'blob'}})
             .done(function(data) {               
                var url = window.URL || window.webkitURL;
                return url.createObjectURL(data);
              })
    }
}
