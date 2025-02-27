namespace Application.Wrappers
{
    public class Response<T>
    {
        public Response() { }
        public Response(T data, string message = null)
        {
            Succeeded = true;
            Message = message;
            Data = data;
        }

        public Response(string message) => (Succeeded, Message) = (false, message);

        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; } = new();
        public T Data { get; set; }

        // Optional: Convenience property for Id if T has an Id property
        public int? Id
        {
            get
            {
                if (Data == null)
                {
                    return null;
                }

                var idProperty = typeof(T).GetProperty("Id");
                if (idProperty == null || idProperty.PropertyType != typeof(int))
                {
                    return null;
                }

                return (int?)idProperty.GetValue(Data);
            }
        }
    }
}
